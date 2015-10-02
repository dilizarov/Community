class AddNormalizedNameToJoinedCommunities < ActiveRecord::Migration
  def change
    add_column :joined_communities, :normalized_name, :text
    
    JoinedCommunity.find_each do |community|
      community.save!
    end
    
    Post.find_each do |post|
      post.save!
    end
    
    change_column :joined_communities, :normalized_name, :text, null: false
        
    add_index :joined_communities, :normalized_name
  end
end
