class AddMetaToUser < ActiveRecord::Migration
  def change
    add_column :users, :meta, :boolean, default: false
  end
end
