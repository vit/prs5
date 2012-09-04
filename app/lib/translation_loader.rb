

	class TranslationLoader
		attr_accessor :path
		def initialize path='./views'
			@path = path
		end
#	def get_template id
#		path = File.join(@path, "#{id}.haml")
#		File::exists?(path) && File::readable?(path) ? File::open(path, 'r:utf-8') { |file| file.read } : nil
		#	end
=begin
		def self.get_translation lang, id, locale_data = nil
		#	path = './'
			path = './app/lang/'
		#	path = ''
		#	path = `pwd`

			lang = [lang.to_s] unless lang.is_a? Array
			#path1 = File.join(@path, "#{id}.lang.yaml")
			path1 = File.join(path, "#{id}.lang.yaml")
		#	path1 = path + '/' + "#{id}.lang.yaml"
			puts path1
			data1 = File::exists?(path1) && File::readable?(path1) ? File::open(path1, 'r:utf-8') { |file| YAML.load file.read } || {} : {}
			puts data1
			puts lang
			data = {}

			lang.each do |l|
				path21 = File.join(path, "#{id}.#{l}.yaml")
				data21 = File::exists?(path21) && File::readable?(path21) ? File::open(path21, 'r:utf-8') { |file| YAML.load file.read } || {} : {}
				data[l] = data1[l] || {}
				data[l].merge!(data21)
			end

			locale_data = lang.inject({}) do |acc,l|
			#	dd = data[l]
				dd = data1[l]
				dd.is_a?(Hash) ? dd.merge(acc) : acc
			end unless locale_data && locale_data.is_a?(Hash)

#			puts locale_data.to_s

			-> s { locale_data[s.to_s] if locale_data }
		#	-> s { locale_data.inspect }
		#	-> s { data1.inspect }
		#	-> s { locale_data.inspect }
		end
=end
		def self.get_locale_data lang, id
		#	path = './'
			path = './app/lang/'

			lang = [lang.to_s] unless lang.is_a? Array
			#path1 = File.join(@path, "#{id}.lang.yaml")
			path1 = File.join(path, "#{id}.lang.yaml")
		#	path1 = path + '/' + "#{id}.lang.yaml"
			puts path1
			data1 = File::exists?(path1) && File::readable?(path1) ? File::open(path1, 'r:utf-8') { |file| YAML.load file.read } || {} : {}
			puts data1
			puts lang
			data = {}

			lang.each do |l|
				path21 = File.join(path, "#{id}.#{l}.yaml")
				data21 = File::exists?(path21) && File::readable?(path21) ? File::open(path21, 'r:utf-8') { |file| YAML.load file.read } || {} : {}
				data[l] = data1[l] || {}
				data[l].merge!(data21)
			end

			lang.inject({}) do |acc,l|
				dd = data1[l]
				dd.is_a?(Hash) ? dd.merge(acc) : acc
			end
		end
		def self.get_translation lang, id, locale_data = nil
			locale_data = get_locale_data lang, id unless locale_data && locale_data.is_a?(Hash)
			-> s { locale_data[s.to_s] if locale_data }
		end
	end


