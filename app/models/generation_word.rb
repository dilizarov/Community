class GenerationWord < ActiveRecord::Base

  validates :kind, presence: true, inclusion: { in: %w(animal adjective), case_sensitive: false }
  validates :word, presence: true
  
  validate :unique_adjective_or_animal
  
  before_save :strip_word
  
  private
  
  def unique_adjective_or_animal
    if kind == "animal"
      errors.add(:word, "is not a unique animal") unless GenerationWord.where(word: word, kind: "animal").count.zero?
    else
      errors.add(:word, "is not a unique adjective") unless GenerationWord.where(word: word, kind: "adjective").count.zero?
    end
  end
  
  def strip_word
    self.word = self.word.strip
  end

end
