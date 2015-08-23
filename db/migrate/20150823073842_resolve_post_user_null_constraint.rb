class ResolvePostUserNullConstraint < ActiveRecord::Migration
  def change
    
    # We handle this on the model layer now.
    change_column_null :posts, :username, true
    change_column_null :posts, :user_id, true
    
  end
end
