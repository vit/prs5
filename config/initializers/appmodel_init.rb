
$:.unshift File.expand_path('../../../../', __FILE__)

require 'prs_model/app'

Coms::App.init( File.expand_path('../../prs_model_conf.yaml', __FILE__) )

