class ForceDatetimeColumnsToConformToMilliNotMicroseconds < ActiveRecord::Migration

  TABLES_AND_COLUMNS = {
    authentication_tokens: [],
    devices: [],
    generation_words: [],
    joined_communities: [],
    notifications: [],
    posts: [],
    replies: [],
    user_notifications: [],
    users: [:reset_password_sent_at],
    votes: []
  }

  STANDARD_ACTIVE_RECORD_COLUMNS = [:created_at, :updated_at]

  TABLES_AND_COLUMNS.each { |k,v| v.concat(STANDARD_ACTIVE_RECORD_COLUMNS) }

  def up
    TABLES_AND_COLUMNS.each do |table, columns|
      columns.each do |column|
        change_column table, column, :datetime, limit: 3
      end
    end
  end

  def down
    TABLES_AND_COLUMNS.each do |table, columns|
      columns.each do |column|
        change_column table, column, :datetime
      end
    end
  end
end
