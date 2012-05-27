class RpcController < ApplicationController
	def call
		user_id = nil
#					@rpc_method = @request.json_body['method']
#					@rpc_params = @request.json_body['params'] || []
#					@rpc_result = @rpc_error = nil
		r = JSON.parse request.body.read
		rpc_method = r['method']
		rpc_params = r['params'] || []
		rpc_result = rpc_error = nil
#		rpc_result = Physcon::App.model.lib.get_doc_info(params)

		rpc_result = {m: rpc_method, p: rpc_params.to_s, w: @appl.user.to_s}

#		rpc_result = @appl.user.get_user_info 1
#		rpc_result = @appl.user.get_user_info *rpc_params

	#	p Coms::OP_Rights.check 1, rpc_method, {rpc_params: rpc_params, appl: @appl}
	#	p Coms::OP_Rights.class
	#	p QQQQQ
	#	p Coms::UserRights.class
	#	p Coms::Rights.class

#		p 'wrong json request' unless @rpc_method
	#	if Coms::OP_Rights.check @current_user[:user_id], @rpc_method, {rpc_params: @rpc_params, appl: @appl}
	#	if Coms::OP_Rights.check @current_user[:user_id], rpc_method, {rpc_params: rpc_params, appl: @appl}
	#	if Coms::OP_Rights.check 1, rpc_method, {rpc_params: rpc_params, appl: @appl}
		if Coms::UserRights.check @current_user[:user_id], rpc_method, {rpc_params: rpc_params, appl: @appl}
			eval "rpc_result = @appl.#{rpc_method} *rpc_params"
		else
		end

#puts rpc_params

#		#if OP_Rights.check @current_user[:user_id], @rpc_method, {rpc_params: @rpc_params, appl: @appl}
#		if rpc_method
#			eval "rpc_result = Physcon::App.model.#{rpc_method} *rpc_params"
#		#else
#		end
		render :json => {result: rpc_result, error: rpc_error}
	end

end

