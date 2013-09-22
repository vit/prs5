# encoding: UTF-8

class Lib::Admin::ItemsController < ApplicationController
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
end

