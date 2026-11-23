# Minutes to read the visible text of a post; code blocks and HTML tags are not counted.
# Turkish pages pass a lower rate: its words are longer, so the same text has about a quarter fewer of them.
module Jekyll
  module ReadingTimeFilter
    def reading_minutes(html, words_per_minute = 230)
      text = html.to_s.gsub(%r{<pre\b.*?</pre>}mi, " ").gsub(/<[^>]*>/, " ")
      [(text.split.size.to_f / words_per_minute.to_i).ceil, 1].max
    end
  end
end

Liquid::Template.register_filter(Jekyll::ReadingTimeFilter)
