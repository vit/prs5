class HomeController < ApplicationController
#	around_filter :wrap_login2
#	def wrap_login2
#		yield
#		#render :text => 'asdfgh'
#	end
  def index
#	@list = Coms::App.model.conf.get_confs_list.select{ |c| c['info'] && c['info']['status']=='active' }
  end
end
