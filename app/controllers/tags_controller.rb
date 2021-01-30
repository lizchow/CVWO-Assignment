class TagsController < ApplicationController
  def index
    tags = ActsAsTaggableOn::Tag.all.order("name ASC")
    render json: tags
  end

  def show
    tag = ActsAsTaggableOn::Tag.find(params[:id])
    todos = Todo.tagged_with(tag.name).order("created_at DESC")
    sorted_todos = todos.select(&:dueDate).sort_by {|x| x.dueDate} + todos.reject(&:dueDate)
    render json: sorted_todos
  end 

  def create
    tag = ActsAsTaggableOn::Tag.create(tag_param)
    render json: tag
  end

  def update
    tag = ActsAsTaggableOn::Tag.find(params[:id])
    if ActsAsTaggableOn::Tag.exists?(name: tag_param[:name])
    	render json: {"error": true}
    else 
    	tag.update_attributes(tag_param)
    	render json: tag
    end
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
