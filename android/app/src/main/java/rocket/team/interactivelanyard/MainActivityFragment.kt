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
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import rocket.team.interactivelanyard.viewmodel.MainViewModel
import kotlinx.android.synthetic.main.main_activity_fragment.*

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
        return inflater.inflate(R.layout.main_activity_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        btRecyclerView.layoutManager = LinearLayoutManager(context)
        rvAdapter = BtDeviceAdapter(context!!) {
            viewModel.stopBluetoothScanning()
            Toast.makeText(context, "Connecting to ${it.name}", Toast.LENGTH_SHORT).show()
            viewModel.connectBluetooth(it.address) {
                findNavController().navigate(R.id.action_device_list_to_send_data)
            }
        }
        btRecyclerView.adapter = rvAdapter

        scanButton.setOnClickListener {
            checkBTState()
            viewModel.getBluetoothDevices().observe(this, Observer { items ->
                Log.d(TAG, "items are $items")
                if (items.isNotEmpty()) {
                    rvAdapter.setItems(items)
                }
            })
        }

        viewModel.isScanning.observe(this, Observer {
            (activity as MainActivity).setProgressBar(it)
        })
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
