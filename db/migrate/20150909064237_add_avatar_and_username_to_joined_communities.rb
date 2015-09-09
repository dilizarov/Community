class AddAvatarAndUsernameToJoinedCommunities < ActiveRecord::Migration
  def change
    add_column :joined_communities, :avatar, :string
    add_column :joined_communities, :username, :string
  end
end
