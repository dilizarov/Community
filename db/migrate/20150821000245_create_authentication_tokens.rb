class CreateAuthenticationTokens < ActiveRecord::Migration
  def change
    create_table :authentication_tokens do |t|
      t.string :token,      null: false
      t.integer :user_id,   null: false

      t.timestamps
    end
    
    add_index :authentication_tokens, :token
    add_index :authentication_tokens, :user_id
  end
end
