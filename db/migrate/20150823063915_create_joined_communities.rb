class CreateJoinedCommunities < ActiveRecord::Migration
  def change
    create_table :joined_communities do |t|
      t.text :name,          null: false
      t.integer :user_id,    null: false

      t.timestamps
    end
    add_index :joined_communities, :name
    add_index :joined_communities, :user_id
  end
end
