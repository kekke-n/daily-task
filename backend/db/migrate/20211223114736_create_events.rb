class CreateEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :events do |t|
      t.integer :status, null: false, default: 1
      t.datetime :start_time
      t.datetime :end_time
      t.text :memo, null: false, default: ''
      t.integer :task_id

      t.timestamps
    end
  end
end
