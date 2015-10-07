class CreateDevices < ActiveRecord::Migration
  def change
    create_table :devices do |t|
      t.text :token,      null: false
      t.text :platform,   null: false
      t.integer :user_id, null: false
      t.integer :auth_id  

      t.timestamps
    end
    add_index :devices, :token
    add_index :devices, :auth_id, unique: true
  end
end
