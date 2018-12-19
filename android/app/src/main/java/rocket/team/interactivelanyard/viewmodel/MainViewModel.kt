package rocket.team.interactivelanyard.viewmodel

import android.app.Application
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothSocket
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import rocket.team.interactivelanyard.DeviceItem
import rocket.team.interactivelanyard.repository.BluetoothRepository
import java.io.IOException
import java.io.OutputStream
import java.util.*

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val bluetoothRepository = BluetoothRepository(getApplication())
    val isScanning = bluetoothRepository.isDiscoveringLiveData
    val bluetoothDevices = bluetoothRepository.bluetoothDevicesLiveData
    private var btSocket: BluetoothSocket? = null
    private var outStream: OutputStream? = null
    private var deviceAddress: String? = null

    fun getBluetoothDevices(){
        Log.d("MainViewModel", "Getting bluetooth")
        bluetoothRepository.getBluetoothDevices()
    }

    fun stopBluetoothScanning() {
        bluetoothRepository.stopDiscovery()
    }

    @Throws(IOException::class)
    private fun createBluetoothSocket(device: BluetoothDevice): BluetoothSocket {
        return device.createRfcommSocketToServiceRecord(MY_UUID)
    }

    fun connectBluetooth(address: String, onConnect: () -> Unit) {
        deviceAddress = address
        val device = bluetoothRepository.btAdapter.getRemoteDevice(deviceAddress)

        try {
            btSocket = createBluetoothSocket(device)

            // Discovery is resource intensive.  Make sure it isn't going on
            // when you attempt to connect and pass your message.
            stopBluetoothScanning()

            // Establish the connection.  This will block until it connects.
            Log.d(TAG, "Connecting")
            if (btSocket != null) {
                btSocket!!.connect()
                Log.d(TAG, "Connection ok")

                // Create a data stream so we can talk to server.
                Log.d(TAG, "Create Socket")
                outStream = btSocket!!.outputStream
                onConnect()
                Log.d(TAG, outStream.toString())
            } else {
                Log.e(TAG, "No bluetooth socket")
            }
        } catch (e: IOException) {
            Log.e(TAG, "Connecting failed " + e.message)
        }
    }

    fun sendData(message: String): Boolean {
        val msgBuffer = message.toByteArray()

        Log.d(TAG, outStream.toString())
        Log.d(TAG, "Send data: $message")

        if (outStream == null) {
            Log.e(TAG, "No out stream")
            return false
        }

        try {
            outStream?.write(msgBuffer)
        } catch (e: IOException) {
            Log.e(TAG, e.message)
            return false
        }
        return true
    }

    companion object {
        private const val TAG = "MainViewModel"

        // SPP UUID service
        private val MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB")
    }
}
