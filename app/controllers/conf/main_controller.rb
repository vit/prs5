class Conf::MainController < ApplicationController
  def list
	@list = Coms::App.model.conf.get_confs_list.select{ |c| c['info'] && c['info']['status']=='active' }
  end
  def index
  end
end
