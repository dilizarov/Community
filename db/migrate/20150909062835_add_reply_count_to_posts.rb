class AddReplyCountToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :replies_count, :integer, default: 0
  end
end
