class Removecolumn < ActiveRecord::Migration[6.0]
  def change
    remove_column :todos, :string
  end
end
