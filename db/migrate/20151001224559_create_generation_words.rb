

class CreateGenerationWords < ActiveRecord::Migration
  def change
    create_table :generation_words do |t|
      t.text :word, null: false
      t.text :kind, null: false
      t.integer :times_used, default: 0

      t.timestamps
    end
    
    add_index :generation_words, :word
    add_index :generation_words, :kind
    
    ActiveRecord::Base.transaction do
      File.open("#{Rails.root}/lib/files/animals", "r").each_line do |line|
        GenerationWord.create(word: line, kind: "animal")
      end
    
      File.open("#{Rails.root}/lib/files/adjectives", "r").each_line do |line|
        GenerationWord.create(word: line, kind: "adjective")
      end
    end    
  end
end
