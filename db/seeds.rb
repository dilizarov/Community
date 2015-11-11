# User Account Information:
# email: test@example.com
# password: test
#
# Two others can also be used and messed around with.

user = User.create_with(password: "test", username: Faker::Internet.user_name).find_or_create_by(email: "test@example.com")
user_one = User.create_with(password: "test2", username: Faker::Internet.user_name).find_or_create_by(email: "test2@example.com")
user_two = User.create_with(password: "test3", username: Faker::Internet.user_name).find_or_create_by(email: "test3@example.com")

users = [user, user_one, user_two]

# Communities user has joined:
# one community
# this is && a & community
# cats
# dogs
# college foozball!
# Texas A&M

community_names = ["one community", "this is && a & community", "cats", "dogs", "college foozball!", "Texas A&M"]

community_relationships = community_names.map do |name|
  JoinedCommunity.create(name: name, user_id: user.id) rescue ActiveRecord::RecordNotUnique
end

# The 3 communities user has not joined, but user_one has joined are the following:
# University of Texas
# California
# Penguins

user_one_community_rels = ["University of Texas", "California", "Penguins"].map do |name|
  JoinedCommunity.create(name: name, user_id: user_one.id) rescue ActiveRecord::RecordNotUnique
end

# Each community user_one or user have joined has 25 posts and each post has potentially some replies, anywhere from 0 to 15.

(community_relationships + user_one_community_rels).each do |rel|
  25.times do |i|

    title = i.even? ? Faker::Lorem.sentence : nil

    post = Post.create(title: title, body: Faker::Lorem.paragraph(5), community: rel.normalized_name, user_id: users.sample.id)

    # There is a 50% chance the post might be liked.

    if rand(2) == 1
      users.each do |user|
        if rand(2) == 1
          post.liked_by(user)
        end
      end
    end

    rand(16).times do |j|
      reply = Reply.create(body: Faker::Lorem.sentences(rand(3) + 1).join(" "), user_id: users.sample.id, post_id: post.id)

      # There is also a 50% chance the reply might be liked
      if rand(2) == 1
        users.each do |user|
          if rand(2) == 1
            reply.liked_by(user)
          end
        end
      end
    end
  end
end
