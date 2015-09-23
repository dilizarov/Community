class UpdateIndexToUniqueForReplies < ActiveRecord::Migration
  def change
    remove_index :replies, :external_id
    add_index :replies, :external_id, unique: true
  end
end
