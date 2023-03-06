import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { QueueItem, QueueItemInfo } from './queue_item'

type DownloadQueueProps = {
    items?: Array<QueueItemInfo> | undefined
    onDelete?: (ix: number)=>void | undefined
    onEdit?: (ix: number)=>void | undefined
}

type DownloadQueueState = {}

class DownloadQueue extends Component<DownloadQueueProps, DownloadQueueState> {
  state = {}

  render() {
    if (this.props.items === undefined || this.props.items.length == 0) {
        return (
            <h5>Empty!</h5>
        );
    }
    else {
        const queue_items = this.props.items.map(
            (i, index)=>(
                <QueueItem
                    key={i.url}
                    index={index}
                    item={i}
                    onDelete={this.props.onDelete}
                    onEdit={this.props.onEdit}
                />
            )
        )
        return (
            <Table size = "sm" hover = {true}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Video / Audio / CC</th>
                    </tr>
                </thead>
                <tbody>
                    {queue_items}
                </tbody>
            </Table>
        )
    }
  }
}

export {DownloadQueue}; export type {DownloadQueueProps};