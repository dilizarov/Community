class AddIndexOnNormalizedNameAndUserIdToJoinedCommunities < ActiveRecord::Migration
  def change
    add_index :joined_communities, [:normalized_name, :user_id], unique: true
  end
end
