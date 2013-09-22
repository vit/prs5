module LibHelper
	def lib_query_str id=nil
		pairs = []
		if id then
			pairs << {k: 'id', v: id}
		elsif params['id'] then
			pairs << {k: 'id', v: params['id']}
		end
		if params['l'] then
			l = params['l']
			l = l=='ru' ? 'ru' : 'en'
			pairs << {k: 'l', v: l}
		end
		pairs.length>0 ? '?'+pairs.map{ |e| e[:k]+'='+e[:v] }.join('&') : ''
	end

	def ml_to_s elm
		%w[en ru].map{ |l| elm[l].to_s }.join(' | ')
	end

end
