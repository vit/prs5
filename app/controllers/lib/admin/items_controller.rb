# encoding: UTF-8

class Lib::Admin::ItemsController < ApplicationController
	TS = -> { Time.now.utc.iso8601(10) }

	#before_action :mongo
	before_filter :mongo

	def index
	#	render text: params.to_s
	#	render action: :show
		show
	end
	def new
		parent = params[:parent]
		if parent
			@path = get_path parent
		end
	end
	def edit
		@id = params[:id] ? params[:id] : nil
		@data = get_data @id
		@path = get_path @id
	end
	def show
		@id = params[:id] ? params[:id] : nil
		@data = nil
		if @id
			@data = get_data @id
			@path = get_path @id
		#	c = @coll.find_one( {'_meta.class' => 'COMS:LIB:ITEM', '_id' => BSON::ObjectId(@id) })
		#	@data = { 'text' => c['text'] }
		end
		@children = @coll.find( {'_meta.class' => 'COMS:LIB:ITEM', '_meta.parent' => @id ? BSON::ObjectId(@id) : nil}).map{ |d| d }
	#	@children = @coll.find().map{ |d| d }

	#	render text: params.to_s
	#	render text: @children.to_s
#		render :show
		respond_to do |format|
			format.html { render :show }
			format.json { render json: @data}
		end
	end
=begin
	def json
		@id = params[:id] ? params[:id] : nil
		@data = nil
		if @id
			@data = get_data @id
#			@data['text']['title']['ru'].force_encoding('UTF-8')
#			@path = get_path @id
		end
#		@children = @coll.find( {'_meta.class' => 'COMS:LIB:ITEM', '_meta.parent' => @id ? BSON::ObjectId(@id) : nil}).map{ |d| d }

		render :json => @data

	#	render :text => @data.to_json
#		render :text => @data.to_json.to_s
#		render :text => JSON(@data)
#		response.headers['Content-type'] = 'text/plain; charset=utf-8'
	#	response.headers['Content-type'] = 'application/json; charset=utf-8'
	end
=end
	def create
		parent = params[:parent]
		text = {title: params[:title], abstract: params[:abstract]}
		id = @coll.insert({
			_meta: {class: 'COMS:LIB:ITEM', parent: parent ? BSON::ObjectId(parent) : nil},
			text: text
		})
		redirect_to parent ? lib_admin_item_path(parent) : lib_admin_items_path
	#	render text: params.to_s
#		render text: id.to_s
	end
	def update
		@id = params[:id] ? params[:id] : nil
		text = {title: params[:title], abstract: params[:abstract]}
		@coll.update(
			{'_meta.class' => 'COMS:LIB:ITEM', '_id' => @id ? BSON::ObjectId(@id) : nil},
			{'$set' => {
				text: text
			}}
		)
		redirect_to lib_admin_item_path(@id)
	end

	def save
		@id = params[:id]
		item = params[:item]
		answer = {}
		if @id && item
			@coll.update(
				{'_meta.class' => 'COMS:LIB:ITEM', '_id' => @id ? BSON::ObjectId(@id) : nil},
				{'$set' => {
					text: item['text'],
					authors: item['authors']
				}}
			)
			answer = item
		end
		render json: answer
	end

	def upload
		id = params['id']
		op = params['op']
		if id
			parent = BSON::ObjectId(id)
			if op=='upload'
				file = params['file']
				lang = params['lang']
				if file && lang
					put_file parent, 'paper', lang, file, {content_type: file.content_type, original_filename: file.original_filename}
				end
			end
			if op=='delete'
				lang = params['lang']
				if lang
					delete_file parent, 'paper', lang
				end
			end
		end
		render json: {par: params.inspect}
	end
	def rpc
		method = params['method']
		id = params['params']['id']
		rez = nil
		case method
			when 'get_files' then rez = find_files( BSON::ObjectId(id) )
			when 'get_conferences_list' then rez = @appl.conf.get_confs_list
			when 'get_conferences_list' then rez = @appl.conf.get_confs_list
			when 'get_papers_list' then rez = @appl.conf.paper.get_all_papers_list id
		end
	#	render json: {par: params.inspect}
		render json: {result: rez}
	end

	def add
		parent = params[:parent]
		item = params[:item]
		id = nil
		if item
			data = item['data']
			if item
				id = @coll.insert({
					_meta: {class: 'COMS:LIB:ITEM', parent: parent ? BSON::ObjectId(parent) : nil},
					text: data['text'],
					authors: data['authors']
				})
			end
		end
		render json: {id: id.to_s}
#		render json: item
	end

	def destroy
		parent = params[:parent]
		@id = params[:id] ? params[:id] : nil
		if @coll.find( {'_meta.class' => 'COMS:LIB:ITEM', '_meta.parent' => BSON::ObjectId(@id)}).count == 0
			@coll.remove({'_meta.class' => 'COMS:LIB:ITEM', '_id' => BSON::ObjectId(@id)})
		end
#		render text: @id.to_s + ' ' + parent.to_s
		redirect_to parent ? lib_admin_item_path(parent) : lib_admin_items_path
	end

	private

	def mongo
		@coll_name = 'lib'
		@coll = @appl.mongo.open_collection @coll_name
		@grid = @appl.mongo.open_grid @coll_name
		@collfiles = @appl.mongo.open_collection @coll_name+'.files'
	end

	def get_path id
		rez = []
		while id do
			c = @coll.find_one( {'_meta.class' => 'COMS:LIB:ITEM', '_id' => BSON::ObjectId(id) })
			data = { '_id' => id, 'text' => c['text'] }
			d = get_data id
			rez.unshift data
			id = c['_meta']['parent']
			id = id ? id.to_s : nil
		end
		rez
	end
	def get_data id
		c = @coll.find_one( {'_meta.class' => 'COMS:LIB:ITEM', '_id' => BSON::ObjectId(id) })
		data = {
			'text' => c['text'],
			'authors' => c['authors']
		}
		data
	end

	def find_files parent
		@collfiles.find( {'_meta.parent' => parent} ).map do |f|
	#	@collfiles.find( {} ).map do |f|
			f
		end
	end
	def find_file parent, type, lang
	#	res = @collfiles.find_one( {'_meta.parent' => parent} )
#		res = @collfiles.find_one()
		res = @collfiles.find_one( {'_meta.parent' => parent, '_meta.type' => type, '_meta.lang' => lang} )
		res ? res['_id'] : nil
	end
	def delete_file parent, type, lang
		old_id = find_file parent, type, lang
		@grid.delete(old_id) if old_id
	end
	def put_file parent, type, lang, input, args={}
		delete_file parent, type, lang
		ts = TS[]
		args.merge!({_meta: {
			parent: parent,
			type: type,
			lang: lang,
			ctime: ts,
			mtime: ts
		}})
		@grid.put input, args
	end
end

