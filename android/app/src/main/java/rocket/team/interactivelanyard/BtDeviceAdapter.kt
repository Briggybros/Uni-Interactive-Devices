package rocket.team.interactivelanyard

import android.content.Context
import android.support.v7.widget.RecyclerView
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import kotlinx.android.synthetic.main.bluetooth_device_list_item.view.*

class BtDeviceAdapter(
        private val items : HashMap<String, DeviceItem>,
        private val context: Context,
        private val listener: (DeviceItem) -> Unit
) : RecyclerView.Adapter<BtViewHolder>() {

    override fun getItemCount(): Int {
        return items.size
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BtViewHolder {
        return BtViewHolder(LayoutInflater.from(context).inflate(R.layout.bluetooth_device_list_item, parent, false))
    }

    override fun onBindViewHolder(holder: BtViewHolder, position: Int) {
        val key = ArrayList<String>(items.keys)[position]
        val item = items[key]
        if (item != null) {
            holder.bind(item, listener)
        }
    }

    fun addItem(key: String, item: DeviceItem) {
        if (items.containsKey(key)) {
            Log.e("BtDeviceAdapter", "Already contains key")
            return
        }
        items[key] = item
        notifyDataSetChanged()
    }

    fun changeItem(key: String, item: DeviceItem) {
        if (!items.containsKey(key)) {
            Log.e("BtDeviceAdapter", "No such key")
            return
        }
        items[key] = item
        notifyDataSetChanged()
    }

    fun clearItems() {
        items.clear()
        notifyDataSetChanged()
    }
}

class BtViewHolder(val view: View) : RecyclerView.ViewHolder(view) {
    fun bind(item: DeviceItem, listener: (DeviceItem) -> Unit) = with(view) {
        deviceDetails.text = item.name
        setOnClickListener {
            listener(item)
        }
    }
}