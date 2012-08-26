class LibController < ApplicationController
#	around_filter :wrap_login2
#	def wrap_login2
#		yield
#		#render :text => 'asdfgh'
#	end
  def index
#	@list = Coms::App.model.conf.get_confs_list.select{ |c| c['info'] && c['info']['status']=='active' }
#	render :text => 'r rt re trt rt wet wer wffqr'
  end
  def conferences
	#render text: 'wwwww'
#	render text: params.to_s
	#render text: lib_query
  end
  def magazines
  end
  def books
  end
end

