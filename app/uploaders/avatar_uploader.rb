# encoding: utf-8

class AvatarUploader < CarrierWave::Uploader::Base
  
  include CarrierWave::MiniMagick

  storage :fog

  #good
  def filename
    return if file.nil?
    
    name = original_filename.present? ? without_extension(original_filename) : "image"
    "#{name}-#{unique_id}.#{file.extension}"
  end

  def store_dir
    "#{model.class.to_s.underscore.pluralize}/#{mounted_as.to_s.downcase.pluralize}/#{model.id}"
  end

  #good
  def extension_white_list
    %w(jpg jpeg png)
  end
  
  private 
  #good
  def without_extension(filename)
    return filename[0...filename.rindex('.')]
  end
  
  #------
  def unique_id
    return unless model.image_id.nil?
    
    loop do
      uuid = SecureRandom.uuid
      break model.image_id = uuid unless model.class.unscoped.where("#{mounted_as.to_s}_id = ?", uuid).first
    end
    
    model.image_id
  end

  # Process files as they are uploaded:
  # process :scale => [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  # Create different versions of your uploaded files:
  # version :thumb do
  #   process :resize_to_fit => [50, 50]
  # end

end
