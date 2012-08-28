class LibController < ApplicationController
	around_filter :wrap_query
	def wrap_query
		yield
	end
  def index
#	@list = Coms::App.model.conf.get_confs_list.select{ |c| c['info'] && c['info']['status']=='active' }
#	render :text => 'r rt re trt rt wet wer wffqr'
  end
  def conferences
	id = Coms::App.model.lib.get_id_by_alias 'conferences'
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
	render :file => 'lib/conferences'
  end
end

