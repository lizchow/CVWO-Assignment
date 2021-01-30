class TodosController < ApplicationController
  def index
    todos = Todo.order("created_at DESC")
    sorted_todos = todos.select(&:dueDate).sort_by {|x| x.dueDate} + todos.reject(&:dueDate)
    render json: sorted_todos
  end

  def create
    todo = Todo.new(todo_param)
    if todo.valid?
        todo.save
        render json: todo
    else 
        render json: {"error": true, "message": "title cannot be empty"}
    end
    
  end

  def update
    todo = Todo.find(params[:id])
    todo.update_attributes(todo_param)
    render json: todo
  end

  def destroy
    todo = Todo.find(params[:id])
    todo.destroy
    head :no_content, status: :ok
  end
  
  private
    def todo_param
      params.require(:todo).permit(:title, :done, :tag_list, :dueDate)
    end
end

