package rocket.team.interactivelanyard

import android.content.Context
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.bluetooth_device_list_item.view.*

class BtDeviceAdapter(
        private val context: Context,
        private val listener: (DeviceItem) -> Unit
) : RecyclerView.Adapter<BtViewHolder>() {
    private var items: Set<DeviceItem>? = null

    override fun getItemCount() = items?.size ?: 0

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BtViewHolder {
        return BtViewHolder(LayoutInflater.from(context).inflate(R.layout.bluetooth_device_list_item, parent, false))
    }

    override fun onBindViewHolder(holder: BtViewHolder, position: Int) {
        val item = items!!.elementAt(position)
        holder.bind(item, listener)
    }

    fun setItems(newItems: Set<DeviceItem>) {
//        if (items == null) {
            items = newItems
            notifyItemRangeChanged(0, newItems.size)
//        } else {
//            val result = DiffUtil.calculateDiff(object : DiffUtil.Callback() {
//                override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
//                    Log.d("BtDeviceAdapter", "old $oldItemPosition new $newItemPosition")
//                    return items!!.elementAt(oldItemPosition) == newItems.elementAt(newItemPosition)
//                }
//
//                override fun getOldListSize() = items!!.size
//
//                override fun getNewListSize() = newItems.size
//
//                override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
//                    Log.d("BtDeviceAdapter", "old $oldItemPosition new $newItemPosition")
//                    val oldItem = items!!.elementAt(oldItemPosition)
//                    val newItem = newItems.elementAt(newItemPosition)
//                    return oldItem == newItem && oldItem.name == newItem.name
//                }
//            })
//            items = newItems
//            result.dispatchUpdatesTo(this)
//        }
    }
}

class BtViewHolder(val view: View) : RecyclerView.ViewHolder(view) {
    fun bind(item: DeviceItem, listener: (DeviceItem) -> Unit) = with(view) {
        deviceDetails.text = if (item.name != "") item.name else item.address
        setOnClickListener {
            listener(item)
        }
    }
}