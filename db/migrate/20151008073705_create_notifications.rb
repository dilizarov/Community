class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.integer :post_id
      t.integer :user_id, null: false
      t.integer :reply_id
      t.text :kind,       null: false

      t.timestamps
    end
    add_index :notifications, :post_id
    add_index :notifications, :user_id
    add_index :notifications, :reply_id
    add_index :notifications, [:post_id, :user_id], unique: true
    add_index :notifications, [:reply_id, :user_id], unique: true
  end
end
