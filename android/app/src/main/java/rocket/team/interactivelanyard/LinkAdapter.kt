package rocket.team.interactivelanyard

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.link_item.view.*

class LinkAdapter(private val context: Context, private val listener: (Intent) -> Unit): RecyclerView.Adapter<LinkViewHolder>() {
    private var items: List<Amulinks>? = null

    override fun getItemCount() = items?.size ?: 0

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LinkViewHolder {
        return LinkViewHolder(LayoutInflater.from(context).inflate(R.layout.link_item, parent, false))
    }

    override fun onBindViewHolder(holder: LinkViewHolder, position: Int) {
        val item = items!![position]
        holder.bind(item, listener)
    }

    fun setLinks(items: List<Amulinks>) {
        this.items = items
        notifyItemRangeChanged(0, items.size)
    }
}

class LinkViewHolder(private val view: View): RecyclerView.ViewHolder(view) {
    fun bind(item: Amulinks, listener: (Intent) -> Unit) = with(view) {
        linkName.text = item.name
        setOnClickListener {
            val uri = Uri.parse(item.url)
            val intent = Intent(Intent.ACTION_VIEW, uri)
            listener(intent)
        }
    }
}
