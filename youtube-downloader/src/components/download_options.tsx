import React, { Component } from "react";
import {
    Col,
    Container,
    FloatingLabel,
    Form,
    Row,
    Image,
    Button,
} from "react-bootstrap";

import queryString from 'query-string';
import { QueueItem, QueueItemInfo } from "./queue_item";
import axios from "axios";
import { API_KEY } from "./secrets";




type DownloadOptionsProps = {
    onEnqueue?: (item: QueueItemInfo) => void | undefined
    item?: QueueItemInfo | undefined
};

type DownloadOptionsState = {
    editing?: string | undefined
    url: string | undefined
    title: string | undefined
    artist: string | undefined
    videoChecked: boolean | undefined
    audioChecked: boolean | undefined
    subsChecked: boolean | undefined
    embedSubsChecked: boolean | undefined
};

async function getVideoInfo(videoId: string): Promise<QueueItemInfo> {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${API_KEY}`
        );
        const nResponses = response.data.pageInfo.totalResults;
        if (nResponses != 1) {
            return Promise.reject("Ambiguous");
        }
        const snippet = response.data.items[0].snippet;
        const videoTitle = snippet.title;
        const videoArtist = snippet.channelTitle;
        const videoThumbnail = snippet.thumbnails.default.url;
        console.log(videoTitle);
        return Promise.resolve(
            {
                url: videoId,
                thumbnail: videoThumbnail,
                title: videoTitle,
                artist: videoArtist,
                audio: false,
                video: true,
                subtitles: true,
                embed_subs: true,
            }
        )
    } catch (error) {
        console.error(error);
        return Promise.reject("Fetch failed")
    }
}

class DownloadOptions extends Component<
    DownloadOptionsProps,
    DownloadOptionsState
> {
    private urlInputRef = React.createRef<HTMLInputElement>();

    constructor(props: DownloadOptionsProps) {
        super(props);

        this.state = {
            editing: undefined,
            url: undefined,
            title: undefined,
            artist: undefined,
            videoChecked: undefined,
            audioChecked: undefined,
            subsChecked: undefined,
            embedSubsChecked: undefined
        };
    }

    getPreview(videoId: string) {
        return (
            <iframe width="560" height="315" src={"https://www.youtube.com/embed/" + videoId} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        );
    }

    getThumbnail(videoId: string) {
        return "https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg";
    }

    getThumbnailPreview(videoId: string) {
        return (
            <Image src={this.getThumbnail(videoId)}></Image>
        )
    }

    handleKeyDown(ev: any) {
        if (ev.key === 'Enter') {
            if (this.urlInputRef.current !== null) {
                this.urlInputRef.current?.blur();
            }
        }
    };

    handleURLChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(
            {
                url: event.target.value
            }
        )
    }

    handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(
            {
                title: event.target.value
            }
        )
    }

    handleArtistChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(
            {
                artist: event.target.value
            }
        )
    }

    handleVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(
            {
                videoChecked: event.target.checked
            }
        )
    }

    handleAudioChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(
            {
                audioChecked: event.target.checked
            }
        )
    }

    handleSubsChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(
            {
                subsChecked: event.target.checked
            }
        )
    }

    handleEmbedChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(
            {
                embedSubsChecked: event.target.checked
            }
        )
    }

    handleVideoInfoRecieved(videoInfo: QueueItemInfo | undefined) {
        if (videoInfo === undefined) {
            this.setState({
                editing: undefined,
                url: undefined,
                title: undefined,
                artist: undefined,
                videoChecked: undefined,
                audioChecked: undefined,
                subsChecked: undefined,
                embedSubsChecked: undefined
            })
        }
        else {
            this.setState(
                {
                    editing: videoInfo.url,
                    url: videoInfo.url,
                    title: videoInfo.title,
                    artist: videoInfo.artist,
                    videoChecked: videoInfo.video,
                    audioChecked: videoInfo.audio,
                    subsChecked: videoInfo.subtitles,
                    embedSubsChecked: videoInfo.embed_subs
                }
            )
        }
    }

    onTextSubmit() {
        let toSetEditing = undefined;
        if (this.urlInputRef.current !== null) {
            const youtubeURL: string = (this.urlInputRef.current.value);
            if (youtubeURL.startsWith("https://www.youtube.com/")) {
                const parsedURL = queryString.parseUrl(youtubeURL);
                const videoId = parsedURL.query["v"];
                const playlistId = parsedURL.query["list"];
                console.log("VIDEO " + videoId);
                console.log("PLAYLIST " + playlistId);
                
                if (typeof videoId == "string") 
                {
                    toSetEditing = videoId;
                    if (toSetEditing !== this.state.editing) {
                        getVideoInfo(videoId).then(this.handleVideoInfoRecieved.bind(this));
                    }
                }
            } else {}
        }
        
        this.setState(
            {
                editing: toSetEditing
            }
        );
    }

    getVideoInfo(): QueueItemInfo | undefined {
        const vinfo: QueueItemInfo = {
            url: this.state.url !== undefined? this.state.url: this.props.item !== undefined? this.props.item.url: "",
            title: this.state.title !== undefined? this.state.title: this.props.item !== undefined? this.props.item.title: "",
            artist: this.state.artist !== undefined? this.state.artist: this.props.item !== undefined? this.props.item.artist: "",
            video: this.state.videoChecked !== undefined? this.state.videoChecked: this.props.item !== undefined? this.props.item.video: true,
            audio: this.state.audioChecked !== undefined? this.state.audioChecked: this.props.item !== undefined? this.props.item.audio: false,
            subtitles: this.state.subsChecked !== undefined? this.state.subsChecked: this.props.item !== undefined? this.props.item.subtitles: true,
            embed_subs: this.state.embedSubsChecked !== undefined? this.state.embedSubsChecked: this.props.item !== undefined? this.props.item.embed_subs: true
        }
        if (vinfo.url.trim().length == 0) {
            return undefined;
        }
        else if (vinfo.video || vinfo.audio || vinfo.subtitles) {
            return vinfo;
        }
        else {
            return undefined;
        }
    }

    handleEnqueue() {
        if (this.props.onEnqueue !== undefined) {
            const vidInfo = this.getVideoInfo();
            if (vidInfo !== undefined) {
                this.props.onEnqueue(vidInfo);
            }
        }
        this.handleVideoInfoRecieved(undefined);
    }

    render() {
        let preview = (<h4>Waiting</h4>);
        if (this.state.editing !== undefined) {
            preview = this.getPreview(this.state.editing);
        }
        else if (this.props.item !== undefined) {
            preview = this.getPreview(this.props.item.url);
        }
        return (
            <>
                <Container fluid>
                    <Row>
                        <Col>
                            <h2>Options</h2>
                        </Col>
                        <Col>
                            <h2>Preview</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form>
                                <Container fluid>
                                    <Row>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel
                                                controlId="floatingTextarea"
                                                label="Video URL"
                                                className="mb-3"
                                            >
                                                <Form.Control
                                                    as="input"
                                                    placeholder="Video URL"
                                                    ref={this.urlInputRef}
                                                    onKeyDown={this.handleKeyDown.bind(this)}
                                                    onBlur={this.onTextSubmit.bind(this)}
                                                    onChange={this.handleURLChange.bind(this)}
                                                    value={this.state.url !== undefined? this.state.url: this.props.item !== undefined? this.props.item.url: ""}
                                                />
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group
                                                className="mb-3"
                                                controlId="formCheckboxes"
                                            >
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Audio (.mp3)"
                                                    onChange={this.handleAudioChange.bind(this)}
                                                    checked={this.state.audioChecked !== undefined? this.state.audioChecked: this.props.item !== undefined? this.props.item.audio: false}
                                                />
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Video (.mp4)"
                                                    onChange={this.handleVideoChange.bind(this)}
                                                    checked={this.state.videoChecked !== undefined? this.state.videoChecked: this.props.item !== undefined? this.props.item.video: true}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3">
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Subtitles"
                                                    onChange={this.handleSubsChange.bind(this)}
                                                    checked={this.state.subsChecked !== undefined? this.state.subsChecked: this.props.item !== undefined? this.props.item.subtitles: true}
                                                />
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Embed subtitles"
                                                    onChange={this.handleEmbedChange.bind(this)}
                                                    checked={this.state.embedSubsChecked !== undefined? this.state.embedSubsChecked: this.props.item !== undefined? this.props.item.embed_subs: true}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3">
                                                <FloatingLabel
                                                    controlId="floatingTextarea"
                                                    label="Title"
                                                    className="mb-3"
                                                >
                                                    <Form.Control
                                                        as="input"
                                                        placeholder="Title"
                                                        onChange={this.handleTitleChange.bind(this)}
                                                        value={this.state.title !== undefined? this.state.title: this.props.item !== undefined? this.props.item.title: ""}
                                                    />
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3">
                                                <FloatingLabel
                                                    controlId="floatingTextarea"
                                                    label="Artist"
                                                    className="mb-3"
                                                >
                                                    <Form.Control
                                                        as="input"
                                                        placeholder="Artist"
                                                        onChange={this.handleArtistChange.bind(this)}
                                                        value={this.state.artist !== undefined? this.state.artist: this.props.item !== undefined? this.props.item.artist: ""}
                                                    />
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Button variant="primary" type="submit" onClick={this.handleEnqueue.bind(this)}>
                                            Enqueue
                                        </Button>
                                    </Row>
                                </Container>
                            </Form>
                        </Col>
                        <Col>
                            {preview}
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export { DownloadOptions };
export type { DownloadOptionsProps };
