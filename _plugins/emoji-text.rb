# Turns emoji shortcodes such as :sparkles: into the emoji characters themselves.
# jemoji only rewrites HTML pages, so text that ends up in a JavaScript file (the search data)
# kept the shortcode. Shortcodes that gemoji does not know, such as "12:30:45", stay as they are.
require 'gemoji'

module Jekyll
  module EmojiText
    def emoji_text(input)
      input.to_s.gsub(/:([\w+-]+):/) do |code|
        emoji = ::Emoji.find_by_alias(Regexp.last_match(1)) # gemoji's Emoji, not jemoji's Jekyll::Emoji
        emoji ? emoji.raw : code
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::EmojiText)
