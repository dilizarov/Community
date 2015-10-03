class AddUniqueIndexingForLowercaseUsernameInUsersAndJoinedCommunities < ActiveRecord::Migration
  def self.up
    execute "CREATE UNIQUE INDEX users_lowercase_username_index ON users(lower(username))"
    execute "CREATE UNIQUE INDEX communities_normalized_name_lowercase_username_index ON joined_communities(normalized_name, lower(username))"
  end
  
  def self.down
    remove_index :users, name: :users_lowercase_username_index
    remove_index :joined_communities, name: :communities_normalized_name_lowercase_username_index
  end
end
