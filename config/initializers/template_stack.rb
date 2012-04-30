
class ActionView::Template
	alias_method :original_render, :render
	def render view, locals, buffer=nil, &b
		view.push_template_name self.inspect
			#puts self.inspect
		#	puts ">>> " + view.get_template_names.inspect
		view.init_translation
		result = original_render view, locals, buffer, &b
		view.drop_translation
			#view.print_template_names
		#	puts "<<< " + view.get_template_names.inspect
		view.pop_template_name
		result
	end
end


