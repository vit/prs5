# coding: UTF-8
%w[spreadsheet stringio csv].each {|r| require r}

class StreamSheet
	require 'spreadsheet'
	require 'stringio'
	def self.writer ext='csv'
		(ext=='xls' ? XLS : CSV).new
	end
	class XLS
		def initialize
			@book = ::Spreadsheet::Workbook.new
			@sheet = @book.create_worksheet
			@row = 0
			@col = 0
		end
		def << values, args={}
			(values.is_a? Array) ? (write_row values, args) : (write_cell values, args)
		end
		def write_cell value, args={}
			format = args[:format] ? Spreadsheet::Format.new(args[:format]) : nil
			@sheet[@row,@col] = value
			@sheet.row(@row).set_format @col, format if format
			@col += 1
		end
		def write_row values, args={}
			format = args[:format] ? Spreadsheet::Format.new(args[:format]) : nil
			values.each do |s|
				@sheet[@row,@col] = s
				@sheet.row(@row).set_format @col, format if format
				@col += 1
			end
			@row += 1
			@col = 0
		end
		def to_s
			s = StringIO.new
			@book.write s
			s.string.force_encoding("BINARY")
		end
	end
	class CSV
		def initialize
			@buf = ''
			@row_buf = []
		end
		def << values, args={}
			(values.is_a? Array) ? (write_row values, args) : (write_cell values, args)
		end
		def write_cell value, args={}
			@row_buf << value.to_s.force_encoding('utf-8')
		end
		def write_row values, args={}
		#	@buf += ::CSV.generate_line(@row_buf+values.map{ |s| s.force_encoding('utf-8') }, {col_sep: ','.force_encoding('utf-8')})
			@buf += ::CSV.generate_line(@row_buf+values.map{ |s| s.to_s.force_encoding('utf-8') }, {col_sep: ?,})
			@row_buf = []
		end
		def to_s
			write_row [] if @row_buf.size > 0
			@buf
		end
	end
end

