class AddDueDateToTodos < ActiveRecord::Migration[6.0]
  def change
    add_column :todos, :dueDate, :date
  end
end
