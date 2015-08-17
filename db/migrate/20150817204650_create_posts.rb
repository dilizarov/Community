class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.uuid :external_id, null: false
      t.text :title
      t.text :body, null: false
      t.text :community, null: false
      t.text :username, null: false

      t.timestamps
    end
    
    add_index :posts, :external_id, unique: true
    add_index :posts, :community
  end
end
