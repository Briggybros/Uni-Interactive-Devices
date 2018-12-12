package rocket.team.interactivelanyard.repository

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import rocket.team.interactivelanyard.DeviceItem

class BluetoothRepository(private val context: Context) {
    private lateinit var bluetoothDevicesLiveData: MutableLiveData<Set<DeviceItem>>
    private val bluetoothDevices = mutableSetOf<DeviceItem>()
    val btAdapter: BluetoothAdapter = BluetoothAdapter.getDefaultAdapter()
    private var isDiscovering = false

    init {

    }

    private val bReceiver = object : BroadcastReceiver() {
        // TODO: handle spinning logic
        override fun onReceive(context: Context, intent: Intent) {
            val action = intent.action
            when (action) {
                BluetoothAdapter.ACTION_DISCOVERY_STARTED -> isDiscovering = true
                BluetoothAdapter.ACTION_DISCOVERY_FINISHED -> isDiscovering = false
                BluetoothDevice.ACTION_FOUND -> {
                    val device = intent.getParcelableExtra<BluetoothDevice>(BluetoothDevice.EXTRA_DEVICE)
                    val newDevice = DeviceItem(device.address)
                    if (device.name != null) newDevice.name = device.name
                    bluetoothDevices.add(newDevice)
                    bluetoothDevicesLiveData.postValue(bluetoothDevices)
                }
            }
        }
    }

    fun getBluetoothDevices(): LiveData<Set<DeviceItem>> {
        if (!::bluetoothDevicesLiveData.isInitialized) {
            bluetoothDevicesLiveData = MutableLiveData()
        }

        if (!isDiscovering) {
            bluetoothDevices.clear()
            bluetoothDevicesLiveData.postValue(bluetoothDevices)
            val filter = IntentFilter(BluetoothDevice.ACTION_FOUND)
            filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_STARTED)
            filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED)
            context.registerReceiver(bReceiver, filter)
            btAdapter.startDiscovery()
        }
        return bluetoothDevicesLiveData
    }

    fun stopDiscovery() {
        if (isDiscovering) {
            btAdapter.cancelDiscovery()
        }
    }

}