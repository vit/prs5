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
	#render text: 'wwwww'
#	render text: params.to_s
	#render text: lib_query
  end
  def periodicals
  end
  def books
  end
end

