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
        items = newItems
        notifyDataSetChanged()
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