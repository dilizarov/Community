class CreateUserNotifications < ActiveRecord::Migration
  def change
    create_table :user_notifications do |t|
      t.integer :user_id, null: false
      t.integer :notification_id, null: false
      t.boolean :read, default: false

      t.timestamps
    end
    add_index :user_notifications, :user_id
    add_index :user_notifications, :notification_id
  end
end
