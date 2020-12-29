class TagsController < ApplicationController
  def index
    tags = ActsAsTaggableOn::Tag.all
    render json: tags
  end

  def show
    tag = ActsAsTaggableOn::Tag.find(params[:id])
    todos = Todo.tagged_with(tag.name)
    render json: todos
  end 

  def create
    tag = ActsAsTaggableOn::Tag.create(tag_param)
    render json: tag
  end

  def update
    tag = ActsAsTaggableOn::Tag.find(params[:id])
    tag.update_attributes(tag_param)
    render json: tag
  end

  def destroy
    tag = ActsAsTaggableOn::Tag.find(params[:id])
    tag.destroy
    head :no_content, status: :ok
  end

  private
    def tag_param
      params.require(:tag).permit(:name)
    end
end
