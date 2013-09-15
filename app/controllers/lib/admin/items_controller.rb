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
		render :show
	end
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
		data = { 'text' => c['text'] }
		data
	end
end

