class Lib::HomeController < ApplicationController
#class LibController < ApplicationController
#	around_filter :wrap_query
	def wrap_query
		yield
	end

	before_filter :mongo

  def index
#	@list = Coms::App.model.conf.get_confs_list.select{ |c| c['info'] && c['info']['status']=='active' }
#	render :text => 'r rt re trt rt wet wer wffqr'
  end
  def conferences
	id = Coms::App.model.lib.get_id_by_alias 'conferences'
	id = '1'
	item id

	#render text: 'wwwww'
	#render text: params.to_s
	#render text: id
	#render text: lib_query
  end
  def periodicals
  end
  def books
  end
	def show
		@id = params[:id] ? params[:id] : nil
		@data = nil
		if @id
			@data = get_data @id
			@path = get_path @id
		end
		@children = @coll.find( {'_meta.class' => 'COMS:LIB:ITEM', '_meta.parent' => @id ? BSON::ObjectId(@id) : nil}).map{ |d| d }
	#	render text: @id.to_s
	end
  def item id=nil
	id = params['id'] unless id
#	@children = []
	@data = Coms::App.model.lib.get_item_data id
	@children = Coms::App.model.lib.get_item_children id
#	if @data then
#		if @data['type']=='CONF' then
#		end
#	end
	#render text: 'wwwww'
#	render :file => 'lib/conferences'
	render :file => 'lib/item'
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

