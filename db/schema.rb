# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151112094446) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "authentication_tokens", force: true do |t|
    t.string    "token",                    null: false
    t.integer   "user_id",                  null: false
    t.timestamp "created_at", precision: 3
    t.timestamp "updated_at", precision: 3
  end

  add_index "authentication_tokens", ["token"], name: "index_authentication_tokens_on_token", using: :btree
  add_index "authentication_tokens", ["user_id"], name: "index_authentication_tokens_on_user_id", using: :btree

  create_table "devices", force: true do |t|
    t.text      "token",                    null: false
    t.text      "platform",                 null: false
    t.integer   "user_id",                  null: false
    t.integer   "auth_id"
    t.timestamp "created_at", precision: 3
    t.timestamp "updated_at", precision: 3
  end

  add_index "devices", ["auth_id"], name: "index_devices_on_auth_id", unique: true, using: :btree
  add_index "devices", ["token"], name: "index_devices_on_token", using: :btree

  create_table "generation_words", force: true do |t|
    t.text      "word",                                 null: false
    t.text      "kind",                                 null: false
    t.integer   "times_used",               default: 0
    t.timestamp "created_at", precision: 3
    t.timestamp "updated_at", precision: 3
  end

  add_index "generation_words", ["kind"], name: "index_generation_words_on_kind", using: :btree
  add_index "generation_words", ["word"], name: "index_generation_words_on_word", using: :btree

  create_table "joined_communities", force: true do |t|
    t.text      "name",                          null: false
    t.integer   "user_id",                       null: false
    t.timestamp "created_at",      precision: 3
    t.timestamp "updated_at",      precision: 3
    t.string    "avatar"
    t.string    "username"
    t.text      "normalized_name",               null: false
  end

  add_index "joined_communities", ["name"], name: "index_joined_communities_on_name", using: :btree
  add_index "joined_communities", ["normalized_name", "user_id"], name: "index_joined_communities_on_normalized_name_and_user_id", unique: true, using: :btree
  add_index "joined_communities", ["normalized_name"], name: "communities_normalized_name_lowercase_username_index", unique: true, using: :btree
  add_index "joined_communities", ["normalized_name"], name: "index_joined_communities_on_normalized_name", using: :btree
  add_index "joined_communities", ["user_id"], name: "index_joined_communities_on_user_id", using: :btree

  create_table "notifications", force: true do |t|
    t.integer   "post_id"
    t.integer   "user_id",                  null: false
    t.integer   "reply_id"
    t.text      "kind",                     null: false
    t.timestamp "created_at", precision: 3
    t.timestamp "updated_at", precision: 3
  end

  add_index "notifications", ["post_id", "user_id"], name: "index_notifications_on_post_id_and_user_id", unique: true, using: :btree
  add_index "notifications", ["post_id"], name: "index_notifications_on_post_id", using: :btree
  add_index "notifications", ["reply_id", "user_id"], name: "index_notifications_on_reply_id_and_user_id", unique: true, using: :btree
  add_index "notifications", ["reply_id"], name: "index_notifications_on_reply_id", using: :btree
  add_index "notifications", ["user_id"], name: "index_notifications_on_user_id", using: :btree

  create_table "posts", force: true do |t|
    t.uuid      "external_id",                               null: false
    t.text      "title"
    t.text      "body",                                      null: false
    t.text      "community",                                 null: false
    t.text      "username"
    t.timestamp "created_at",      precision: 3
    t.timestamp "updated_at",      precision: 3
    t.integer   "user_id"
    t.integer   "replies_count",                 default: 0
    t.integer   "cached_votes_up",               default: 0
  end

  add_index "posts", ["community"], name: "index_posts_on_community", using: :btree
  add_index "posts", ["external_id"], name: "index_posts_on_external_id", unique: true, using: :btree
  add_index "posts", ["user_id"], name: "index_posts_on_user_id", using: :btree

  create_table "replies", force: true do |t|
    t.uuid      "external_id",                               null: false
    t.text      "body",                                      null: false
    t.integer   "user_id"
    t.integer   "post_id",                                   null: false
    t.timestamp "created_at",      precision: 3
    t.timestamp "updated_at",      precision: 3
    t.integer   "cached_votes_up",               default: 0
  end

  add_index "replies", ["external_id"], name: "index_replies_on_external_id", unique: true, using: :btree
  add_index "replies", ["post_id"], name: "index_replies_on_post_id", using: :btree
  add_index "replies", ["user_id"], name: "index_replies_on_user_id", using: :btree

  create_table "user_notifications", force: true do |t|
    t.integer   "user_id",                                       null: false
    t.integer   "notification_id",                               null: false
    t.boolean   "read",                          default: false
    t.timestamp "created_at",      precision: 3
    t.timestamp "updated_at",      precision: 3
  end

  add_index "user_notifications", ["notification_id"], name: "index_user_notifications_on_notification_id", using: :btree
  add_index "user_notifications", ["user_id"], name: "index_user_notifications_on_user_id", using: :btree

  create_table "users", force: true do |t|
    t.string    "email",                                default: "",    null: false
    t.string    "encrypted_password",                   default: "",    null: false
    t.string    "reset_password_token"
    t.timestamp "reset_password_sent_at", precision: 3
    t.string    "username",                                             null: false
    t.uuid      "external_id",                                          null: false
    t.timestamp "created_at",             precision: 3
    t.timestamp "updated_at",             precision: 3
    t.string    "avatar"
    t.boolean   "meta",                                 default: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["username"], name: "index_users_on_username", unique: true, using: :btree

  create_table "votes", force: true do |t|
    t.integer   "votable_id"
    t.string    "votable_type"
    t.integer   "voter_id"
    t.string    "voter_type"
    t.boolean   "vote_flag"
    t.string    "vote_scope"
    t.integer   "vote_weight"
    t.timestamp "created_at",   precision: 3
    t.timestamp "updated_at",   precision: 3
  end

  add_index "votes", ["votable_id", "votable_type", "vote_scope"], name: "index_votes_on_votable_id_and_votable_type_and_vote_scope", using: :btree
  add_index "votes", ["voter_id", "voter_type", "vote_scope"], name: "index_votes_on_voter_id_and_voter_type_and_vote_scope", using: :btree

end
