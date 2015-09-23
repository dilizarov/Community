class CreateReplies < ActiveRecord::Migration
  def change
    create_table :replies do |t|
      t.uuid :external_id, null: false
      t.text :body,        null: false
      t.integer :user_id
      t.integer :post_id,  null: false

      t.timestamps
    end
    
    add_index :replies, :external_id
    add_index :replies, :user_id
    add_index :replies, :post_id
  end
end
