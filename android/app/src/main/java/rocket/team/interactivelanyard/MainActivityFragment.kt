package rocket.team.interactivelanyard

import android.bluetooth.BluetoothAdapter
import android.content.Intent
import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import rocket.team.interactivelanyard.viewmodel.MainViewModel

class MainActivityFragment : Fragment() {

    companion object {
        fun newInstance() = MainActivityFragment()
        private const val TAG = "MainActivityFragment"
    }

    private lateinit var rvAdapter: BtDeviceAdapter
    private val viewModel: MainViewModel by lazy {
        ViewModelProviders.of(this).get(MainViewModel::class.java)
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View {
        return inflater.inflate(R.layout.main_activity2_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        btRecyclerView.layoutManager = LinearLayoutManager(context)
        rvAdapter = BtDeviceAdapter(context!!) {
            viewModel.stopBluetoothScanning()
            Toast.makeText(context, "Connecting to ${it.name}", Toast.LENGTH_SHORT).show()
            viewModel.connectBluetooth(it.address)
        }
        btRecyclerView.adapter = rvAdapter

        scanButton.setOnClickListener {
            // TODO: Show spinner or something
            checkBTState()
            viewModel.getBluetoothDevices().observe(this, Observer { items ->
                Log.d(TAG, "items are $items")
                if (items.isNotEmpty()) {
                    rvAdapter.setItems(items)
                }
            })
        }

        sendButton.setOnClickListener {
            val name = nameEditText.text.toString()
            val deets = deetsEditText.text.toString()
            val data = "{" +
                    "\"name\": \"$name\", " +
                    "\"deets\": \"$deets\"" +
                    "}"
            val succ = viewModel.sendData(data)
            if (succ) {
                Toast.makeText(context, "Sent data", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(context, "Could not send data", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun checkBTState() {
        // Check for Bluetooth support and then check to make sure it is turned on
        // Emulator doesn't support Bluetooth and will return null
        if (BluetoothAdapter.getDefaultAdapter().isEnabled) {
            Log.d(TAG, "Bluetooth ON")
        } else {
            //Prompt user to turn on Bluetooth
            val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
            startActivityForResult(enableBtIntent, 1)
        }
    }
}
