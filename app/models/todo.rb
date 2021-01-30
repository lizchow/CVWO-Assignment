class Todo < ApplicationRecord
    validates :title, presence: true
    acts_as_taggable_on :tags
end
